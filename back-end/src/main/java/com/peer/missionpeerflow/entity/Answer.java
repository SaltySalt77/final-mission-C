package com.peer.missionpeerflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sun.istack.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Table(name = "answer")
@Entity
public class Answer extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long answerId;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "question_id")
	@JsonIgnore
	private Question question;

	@Column(nullable = false)
	private Long recommend = 0L;

	@Column(nullable = false)
	private Boolean isAdopted;

	@OneToMany(mappedBy = "answer", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<AnswerComment> answerCommentList = new ArrayList<>();


	@Builder
	public Answer(Question question, Long recommend, boolean isAdopted, String content, String password, String nickname, List<AnswerComment> answerCommentList){
		this.question = question;
		this.recommend = recommend;
		this.isAdopted = isAdopted;
		this.content = content;
		this.password = password;
		this.nickname = nickname;
		this.answerCommentList = answerCommentList;
	}

	public void update(String content, String nickname){
		this.content = content;
		this.nickname = nickname;
	}

	public void updateRecommend(Long recommend){
		this.recommend = recommend;
	}

	public void updateIsAdopted(Boolean isAdopted){
		this.isAdopted = isAdopted;
	}
}
